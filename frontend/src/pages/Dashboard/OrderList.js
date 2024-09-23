import React, { useEffect, useState } from 'react';
import { FiEye, FiCheckCircle, FiX } from 'react-icons/fi';
import { Modal, Button, Table, message, Input } from 'antd';
import { useOrder } from '../../context/OrderContext';
import * as XLSX from 'xlsx';

const { Search } = Input;

const OrderList = () => {
  const { pendingOrders, isLoading, fetchPendingOrders, confirmOrder, cancelOrder, getOrderDetails } = useOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  const showModal = async (orderId) => {
    try {
      const orderDetails = await getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch order details');
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirmOrder = async (id) => {
    try {
      await confirmOrder(id);
      message.success('Order confirmed successfully');
    } catch (error) {
      message.error('Failed to confirm order');
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      await cancelOrder(id);
      message.success('Order cancelled successfully');
    } catch (error) {
      message.error('Failed to cancel order');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pendingOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const filteredOrders = pendingOrders.filter(order => 
    order.web_user_id.toString().includes(searchQuery) || 
    order.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'User ID',
      dataIndex: 'web_user_id',
      key: 'web_user_id',
      width: 100,
    },
    {
      title: 'Customer',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Total',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity) => (quantity ? quantity : 'N/A'),
    },
    {
      title: 'Items',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 80,
      render: (product_id) => (product_id ? product_id : 'N/A'),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (created_at) => (created_at ? new Date(created_at).toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<FiEye />}
            onClick={() => showModal(record.id)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            icon={<FiCheckCircle />}
            onClick={() => handleConfirmOrder(record.id)}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            icon={<FiX />}
            onClick={() => handleCancelOrder(record.id)}
            className="text-red-600 hover:text-red-800"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Order List</h2>
      <div className="flex justify-between items-center mb-4">
        <Search 
          placeholder="Search by User ID or Customer Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button type="primary" onClick={exportToExcel}>Export Orders</Button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={filteredOrders} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            responsive: true,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 'max-content' }}
          loading={isLoading}
        />
      </div>

      <Modal
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="space-y-2">
            <p><strong>Order ID:</strong> {selectedOrder.id || 'N/A'}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.full_name || 'N/A'}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity || 'N/A'}</p>
            <p><strong>Product ID:</strong> {selectedOrder.product_id || 'N/A'}</p>
            <p><strong>Date:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
            <p><strong>Mobile Number:</strong> {selectedOrder.mobilenumber || 'N/A'}</p>
            <p><strong>Emirates:</strong> {selectedOrder.selected_emirates || 'N/A'}</p>
            <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address || 'N/A'}</p>
            <p><strong>Selected Attributes:</strong> {selectedOrder.selected_attributes || 'N/A'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;