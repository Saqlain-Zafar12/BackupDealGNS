import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Select, Input } from 'antd';
import { EyeOutlined, CarOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useOrder } from '../../context/OrderContext';
import { useDeliveryType } from '../../context/deliveryTypeContext';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Search } = Input;

const ConfirmOrderList = () => {
  const { confirmedOrders, isLoading, fetchConfirmedOrders, getOrderDetails, deliverOrder, assignDeliveryType } = useOrder();
  const { deliveryTypes, fetchDeliveryTypes } = useDeliveryType();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConfirmedOrders();
    fetchDeliveryTypes();
  }, [fetchConfirmedOrders, fetchDeliveryTypes]);

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

  const handleDeliverOrder = async (id) => {
    try {
      await deliverOrder(id);
      message.success('Order marked as delivered successfully');
      fetchConfirmedOrders();
    } catch (error) {
      message.error('Failed to mark order as delivered');
    }
  };

  const handleAssignDeliveryType = async (orderId, deliveryTypeName) => {
    try {
      await assignDeliveryType(orderId, deliveryTypeName);
      message.success('Delivery type assigned successfully');
      fetchConfirmedOrders();
    } catch (error) {
      message.error('Failed to assign delivery type');
    }
  };

  const handleExportToExcel = () => {
    const data = confirmedOrders.map(order => ({
      'Order ID': order.id,
      'User ID': order.web_user_id,
      'Customer': order.full_name,
      'Quantity': order.quantity || 'N/A',
      'Product ID': order.product_id || 'N/A',
      'Date': order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A',
      'Delivery Type': order.delivery_type_name || 'Not assigned',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Confirmed Orders');
    XLSX.writeFile(workbook, 'ConfirmedOrders.xlsx');
  };

  const filteredOrders = confirmedOrders.filter(order => 
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
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity) => (quantity ? quantity : 'N/A'),
    },
    {
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 100,
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
      title: 'Delivery Type',
      dataIndex: 'delivery_type_name',
      key: 'delivery_type_name',
      width: 150,
      render: (delivery_type_name, record) => (
        <Select
          style={{ width: 120 }}
          value={delivery_type_name || 'Assign'}
          onChange={(value) => handleAssignDeliveryType(record.id, value)}
        >
          {deliveryTypes.map((type) => (
            <Option key={type.id} value={type.name}>
              {type.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => showModal(record.id)} />
          <Button onClick={() => handleDeliverOrder(record.id)}>
            <CarOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Confirmed Order List</h2>
      <Search 
        placeholder="Search by User ID or Customer Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button 
        type="primary" 
        icon={<FileExcelOutlined />} 
        onClick={handleExportToExcel}
        style={{ marginBottom: 16 }}
      >
        Export to Excel
      </Button>
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={filteredOrders} 
          rowKey="id" 
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <div>
            <p><strong>Order ID:</strong> {selectedOrder.id || 'N/A'}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.full_name || 'N/A'}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity || 'N/A'}</p>
            <p><strong>Product ID:</strong> {selectedOrder.product_id || 'N/A'}</p>
            <p><strong>Date:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
            <p><strong>Mobile Number:</strong> {selectedOrder.mobilenumber || 'N/A'}</p>
            <p><strong>Emirates:</strong> {selectedOrder.selected_emirates || 'N/A'}</p>
            <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address || 'N/A'}</p>
            <p><strong>Selected Attributes:</strong> {selectedOrder.selected_attributes || 'N/A'}</p>
            <p><strong>Delivery Type:</strong> {selectedOrder.delivery_type_name || 'Not assigned'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConfirmOrderList;