import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, Alert, Typography, Layout } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { useDashboard } from '../../context/dashboardContext';

const { Title } = Typography;
const { Content } = Layout;

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

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  if (error) return <Alert message={error} type="error" style={{ margin: '24px' }} />;

  const topProductsColumns = [
    { title: 'Product', dataIndex: 'en_title', key: 'en_title', ellipsis: true },
    { title: 'Orders', dataIndex: 'order_count', key: 'order_count' },
  ];

  const lowStockColumns = [
    { title: 'Product', dataIndex: 'en_title', key: 'en_title', ellipsis: true },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  ];

  const calculateRevenueSummary = () => {
    if (!revenueStats.dailyRevenue || revenueStats.dailyRevenue.length === 0) {
      return { total: 0, change: 0, isPositive: true };
    }

    const total = parseFloat(revenueStats.dailyRevenue[0].revenue);

    return {
      total: total.toFixed(2),
      change: 0,
      isPositive: true
    };
  };

  const revenueSummary = calculateRevenueSummary();

  const statCards = [
    { title: "Total Products", value: dashboardStats?.totalProducts || 0, icon: <ShoppingOutlined /> },
    { title: "Total Orders", value: dashboardStats?.totalOrders || 0, icon: <ShoppingCartOutlined /> },
    { title: "Total Categories", value: dashboardStats?.totalCategories || 0, icon: <UserOutlined /> },
    { title: "Total Brands", value: dashboardStats?.totalBrands || 0, icon: <DollarOutlined /> }
  ];

  return (
    <Layout className="bg-green-50">
      <Content className="bg-green-50" style={{ padding: '24px', minHeight: '100vh' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>Dashboard</Title>
        
        <Row gutter={[24, 24]}>
          {statCards.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card hoverable>
                <Statistic title={item.title} value={item.value} prefix={item.icon} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={12}>
            <Card title="Revenue Summary" hoverable style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Statistic
                  title="Total Revenue"
                  value={revenueSummary.total}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  suffix="AED"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Top Selling Products" hoverable style={{ height: '100%' }}>
              <Table 
                dataSource={dashboardStats?.topSellingProducts || []}
                columns={topProductsColumns} 
                pagination={false}
                scroll={{ x: true, y: 240 }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={12}>
            <Card title="Low Stock Products" hoverable>
              <Table 
                dataSource={productStats?.lowStockProducts || []}
                columns={lowStockColumns} 
                pagination={false}
                scroll={{ x: true }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Orders by Status" hoverable>
              <Row gutter={[16, 16]}>
                {['pending', 'confirmed', 'delivered'].map((status, index) => (
                  <Col xs={24} sm={8} key={index}>
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
      </Content>
    </Layout>
  );
};

export default Dashboard;
