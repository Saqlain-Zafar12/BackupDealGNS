import React, { useState } from 'react';
import { FiEye, FiCheckCircle, FiX } from 'react-icons/fi';
import { Modal, Button, Table } from 'antd';

const OrderList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - replace with actual data fetching logic
  const orders = [
    { id: 1, customerName: 'John Doe', total: 59.97, items: 3, date: '2023-05-01' },
    { id: 2, customerName: 'Jane Smith', total: 89.98, items: 4, date: '2023-05-02' },
    { id: 3, customerName: 'Bob Johnson', total: 39.99, items: 2, date: '2023-05-03' },
  ];

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<FiEye />}
            onClick={() => showModal(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            icon={<FiCheckCircle />}
            onClick={() => console.log('Confirm order', record.id)}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            icon={<FiX />}
            onClick={() => console.log('Cancel order', record.id)}
            className="text-red-600 hover:text-red-800"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Order List</h2>
      <div className="overflow-x-auto">
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="min-w-full"
          scroll={{ x: true }}
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
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
            <p><strong>Items:</strong> {selectedOrder.items}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            {/* Add more order details here */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;