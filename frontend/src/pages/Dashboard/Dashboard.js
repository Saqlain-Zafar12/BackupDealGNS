import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, Alert, Progress } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, UserOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDashboard } from '../../context/dashboardContext';

const Dashboard = () => {
  const { 
    dashboardStats, 
    revenueStats, 
    productStats, 
    loading, 
    error, 
    fetchDashboardStats,    
    fetchRevenueStats, 
    fetchProductStats 
  } = useDashboard();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchDashboardStats(), fetchRevenueStats(), fetchProductStats()]);
    };
    fetchData();
  }, [fetchDashboardStats, fetchRevenueStats, fetchProductStats]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  const topProductsColumns = [
    { title: 'Product', dataIndex: 'en_title', key: 'en_title' },
    { title: 'Orders', dataIndex: 'order_count', key: 'order_count' },
  ];

  const lowStockColumns = [
    { title: 'Product', dataIndex: 'en_title', key: 'en_title' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  ];

  const calculateRevenueSummary = () => {
    if (!revenueStats.dailyRevenue || revenueStats.dailyRevenue.length === 0) {
      return { total: 0, change: 0, isPositive: true };
    }

    const total = revenueStats.dailyRevenue.reduce((sum, day) => sum + parseFloat(day.revenue), 0);
    const halfLength = Math.floor(revenueStats.dailyRevenue.length / 2);
    const firstHalf = revenueStats.dailyRevenue.slice(0, halfLength);
    const secondHalf = revenueStats.dailyRevenue.slice(halfLength);

    const firstHalfTotal = firstHalf.reduce((sum, day) => sum + parseFloat(day.revenue), 0);
    const secondHalfTotal = secondHalf.reduce((sum, day) => sum + parseFloat(day.revenue), 0);

    const change = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;

    return {
      total: total.toFixed(2),
      change: Math.abs(change).toFixed(2),
      isPositive: change >= 0
    };
  };

  const revenueSummary = calculateRevenueSummary();

  return (
    <div className="dashboard">
      <Row gutter={16}>
        {[
          { title: "Total Products", value: dashboardStats?.totalProducts || 0, icon: <ShoppingOutlined /> },
          { title: "Total Orders", value: dashboardStats?.totalOrders || 0, icon: <ShoppingCartOutlined /> },
          { title: "Total Categories", value: dashboardStats?.totalCategories || 0, icon: <UserOutlined /> },
          { title: "Total Brands", value: dashboardStats?.totalBrands || 0, icon: <DollarOutlined /> }
        ].map((item, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic title={item.title} value={item.value} prefix={item.icon} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Revenue Summary">
            <Statistic
              title="Total Revenue"
              value={revenueSummary.total}
              precision={2}
              valueStyle={{ color: revenueSummary.isPositive ? '#3f8600' : '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <Statistic
              title="Revenue Change"
              value={revenueSummary.change}
              precision={2}
              valueStyle={{ color: revenueSummary.isPositive ? '#3f8600' : '#cf1322' }}
              prefix={revenueSummary.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
            <Progress
              percent={revenueSummary.change}
              status={revenueSummary.isPositive ? "success" : "exception"}
              showInfo={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Selling Products">
            <Table 
              dataSource={dashboardStats?.topSellingProducts || []}
              columns={topProductsColumns} 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Low Stock Products">
            <Table 
              dataSource={productStats?.lowStockProducts || []}
              columns={lowStockColumns} 
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Orders by Status">
            <Row>
              {['pending', 'confirmed', 'delivered'].map((status, index) => (
                <Col span={8} key={index}>
                  <Statistic 
                    title={status.charAt(0).toUpperCase() + status.slice(1)} 
                    value={dashboardStats?.ordersByStatus?.[status] || 0} 
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
