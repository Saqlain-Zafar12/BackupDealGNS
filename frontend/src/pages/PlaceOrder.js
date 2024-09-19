import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Select, Button, message, Layout, Row, Col, Card, Typography, Tabs } from 'antd';
import { FaShoppingCart, FaTruck, FaPercent } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebRelated } from '../context/WebRelatedContext';

const { Option } = Select;
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PlaceOrder = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { product } = location.state || {};
  const { getWebProductDataById, createWebOrder } = useWebRelated();
  const [productData, setProductData] = useState(product || null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [form] = Form.useForm();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (product && product.id && !dataFetchedRef.current) {
        try {
          const data = await getWebProductDataById(product.id);
          setProductData(data);
          dataFetchedRef.current = true;
        } catch (error) {
          console.error('Error fetching product data:', error);
          message.error(t('errors.fetchProductData'));
        }
      }
    };

    fetchProductData();
  }, [product, getWebProductDataById, t]);

  const productImages = [
    'https://plus.unsplash.com/premium_photo-1679830513865-cd8256abe2c1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1607930647942-2820445f77e8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1676790134077-4ade5c365cfe?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1605947064908-65712a69ee6d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1711700357997-7dd71318d2bd?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  const onFinish = async (values) => {
    try {
      const selectedAttributes = productData.attributes.map((attribute, index) => {
        const value = values[`attribute_${index}`];
        return `${attribute.en_attribute_name}:${value}`;
      });

      const orderData = {
        web_user_id: 'user123', // Replace with actual user ID
        full_name: values.fullName,
        mobilenumber: values.mobile,
        quantity: values.quantity,
        selected_emirates: 1,
        delivery_address: values.address,
        product_id: product.id,
        selected_attributes: selectedAttributes,
      };

      const result = await createWebOrder(orderData);
      message.success(t('placeOrder.orderSuccess'));
      navigate('/order-confirmation', { state: { orderId: result.id } });
    } catch (error) {
      console.error('Error creating order:', error);
      message.error(t('errors.createOrder'));
    }
  };

  const handleImageChange = (key) => {
    setSelectedImage(parseInt(key));
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    if (isZoomed && imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomPosition({ x, y });
    }
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  const title = i18n.language === 'ar' ? productData.ar_title : productData.en_title;
  const description = i18n.language === 'ar' ? productData.ar_description : productData.en_description;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="px-4 py-12">
        <div className="container mx-auto">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Card>
                <Title level={4} className="mb-4">
                  {title}
                </Title>
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '300px',
                    cursor: isZoomed ? 'move' : 'zoom-in',
                  }}
                  onClick={handleImageClick}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    ref={imageRef}
                    src={productImages[selectedImage]}
                    alt={`${t('placeOrder.mainImage')}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isZoomed ? 'scale(2)' : 'scale(1)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transition: 'transform 0.3s ease-out',
                    }}
                  />
                </div>
                <Tabs defaultActiveKey="0" onChange={handleImageChange}>
                  {productImages?.map((image, index) => (
                    <TabPane
                      tab={
                        <img
                          src={image}
                          alt={`${t('placeOrder.thumbnail')} ${index + 1}`}
                          className="w-16 h-16 object-cover"
                        />
                      }
                      key={index}
                    />
                  ))}
                </Tabs>
                <div className="mt-4">
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong className="text-2xl text-red-500">
                        {productData.total_price} AED
                      </Text>
                      <Text delete className="ml-2 text-gray-500">
                        {productData.actual_price} AED
                      </Text>
                    </Col>
                    <Col>
                      <Text className="flex items-center">
                        <FaPercent className="mr-1" /> {productData.discount}% {t('product.off')}
                      </Text>
                    </Col>
                  </Row>
                  <Row justify="space-between" className="mt-2">
                    <Col>
                      <Text className="flex items-center text-blue-500">
                        <FaShoppingCart className="mr-2" />
                        {productData.sold_items} {t('placeOrder.itemsSold')}
                      </Text>
                    </Col>
                    <Col>
                      <Text className="flex items-center text-green-500">
                        <FaTruck className="mr-2" />
                        {t('product.freeDelivery')}
                      </Text>
                    </Col>
                  </Row>
                  <Paragraph className="mt-4">{description}</Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Card title={t('placeOrder.orderNow')}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    name="fullName"
                    label={t('placeOrder.fullName')}
                    rules={[{ required: true, message: t('placeOrder.fullNameRequired') }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="mobile"
                    label={t('placeOrder.mobile')}
                    rules={[{ required: true, message: t('placeOrder.mobileRequired') }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="quantity"
                    label={t('placeOrder.quantity')}
                    rules={[{ required: true, message: t('placeOrder.quantityRequired') }]}
                  >
                    <Select>
                      {productData?.quantity_selector_values?.map((option) => (
                        <Option key={option.quantity} value={option.quantity}>
                          {option.quantity} - {option.price} AED
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {productData?.attributes?.map((attribute, index) => (
                    <Form.Item
                      key={index}
                      name={`attribute_${index}`}
                      label={i18n.language === 'ar' ? attribute.ar_attribute_name : attribute.en_attribute_name}
                      rules={[{ required: true, message: t('placeOrder.attributeRequired') }]}
                    >
                      <Select>
                        {attribute.values.map((value) => (
                          <Option key={value} value={value}>
                            {value}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ))}
                  <Form.Item
                    name="emirates"
                    label={t('placeOrder.emirates')}
                    rules={[{ required: true, message: t('placeOrder.emiratesRequired') }]}
                  >
                    <Select>
                      <Option value="">{t('placeOrder.selectCity')}</Option>
                      <Option value="dubai">Dubai</Option>
                      <Option value="abudhabi">Abu Dhabi</Option>
                      <Option value="sharjah">Sharjah</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label={t('placeOrder.deliveryAddress')}
                    rules={[{ required: true, message: t('placeOrder.addressRequired') }]}
                  >
                    <Input.TextArea rows={3} placeholder={t('placeOrder.addressPlaceholder')} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      {t('placeOrder.submitOrder')}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default PlaceOrder;