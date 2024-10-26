import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Select, Button, message, Layout, Row, Col, Card, Typography, Tabs, Modal, Image } from 'antd';
import { FaShoppingCart, FaTruck, FaPercent, FaTag } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebRelated } from '../context/WebRelatedContext';
import Cookies from 'js-cookie';
import Paragraph from 'antd/es/skeleton/Paragraph';

const { Option } = Select;
const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
setTimeout(() => {
  window.scrollTo(0, 0);
}, 100);
const ImageViewer = ({ currentImage, t, discount, freeDelivery }) => {
  return (
    <div className="relative">
      <Image
        src={currentImage}
        alt="Product"
        className="w-full h-auto object-contain"
        preview={{
          maskClassName: 'customize-mask',
          mask: (
            <div className="customize-mask">
              {t('product.clickToView')}
            </div>
          ),
        }}
      />
      {(discount > 0 || freeDelivery) && (
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <FaTag className="mr-1" /> {parseInt(discount)}% {t('product.off')}
            </div>
          )}
          {freeDelivery && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <FaTruck className="mr-1" /> {t('product.freeDelivery')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
setTimeout(() => {
  window.scrollTo(0, 0);
}, 100);
const PlaceOrder = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { product } = location.state || {};
  const { getWebProductDataById, createWebOrder } = useWebRelated();
  const [productData, setProductData] = useState(product || null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (product && product.id && !dataFetchedRef.current) {
        try {
          const data = await getWebProductDataById(product.id);
          console.log(data,"sadsadsadsadas")
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

  const validateDubaiPhoneNumber = (_, value) => {
    const phoneRegex = /^(50|52|54|55|56)\d{7}$/;
    if (!value || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(t('placeOrder.invalidDubaiNumber')));
  };

  const onFinish = async (values) => {
    try {
      const selectedAttributes = productData.attributes.map((attribute, index) => {
        const value = values[`attribute_${index}`];
        return `${attribute.en_attribute_name}:${value}`;
      });

      const orderData = {
        web_user_id: Cookies.get('web_user_id'),
        full_name: values.fullName,
        mobilenumber: `971${values.mobile}`, // Prepend 971 to the mobile number
        quantity: values.quantity,
        selected_emirates: values.emirates,
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

  if (!productData) {
    return <div>Loading...</div>;
  }

  const title = i18n.language === 'ar' ? productData.ar_title : productData.en_title;
  const description = i18n.language === 'ar' ? productData.ar_description : productData.en_description;

  const tabsImageUrl = productData.tabs_image_url
    ? (typeof productData.tabs_image_url === 'string' 
        ? JSON.parse(productData.tabs_image_url) 
        : productData.tabs_image_url)
    : [];

  const defaultImage = 'path/to/default/image.jpg'; // Replace with your default image path
  const currentImage = tabsImageUrl[selectedImage] || defaultImage;

  // Add this function to determine if delivery is free
  const isDeliveryFree = (charges) => {
    const result = parseFloat(charges) <= 0;
    console.log('isDeliveryFree:', { charges, result });
    return result;
  };
console.log(productData)
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="px-4 py-12">
        <div className="container mx-auto">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Card>
                {console.log('Product Data:', productData)} {/* Add this line */}
                <ImageViewer 
                  currentImage={currentImage} 
                  t={t} 
                  discount={productData.discount} 
                  freeDelivery={isDeliveryFree(productData.delivery_charges)}
                />
                {tabsImageUrl.length > 0 && (
                  <Tabs
                    defaultActiveKey="0"
                    onChange={setSelectedImage}
                    direction={i18n.language === 'ar' ? 'rtl' : 'ltr'} // Set direction based on language
                  >
                    {tabsImageUrl.map((image, index) => (
                      <TabPane
                        tab={
                          <img
                            src={`${image}`}
                            alt={`${t('placeOrder.thumbnail')} ${index + 1}`}
                            className="w-16 h-16 object-cover"
                          />
                        }
                        key={index}
                      />
                    ))}
                  </Tabs>
                )}
                <div className="mt-4">
                <Title level={4} className="mb-4">
                {title}
              </Title>
                  <Row justify="space-between" align="middle">
                
                    <Col>
                      <Text strong className="text-2xl text-red-500">
                        {productData.total_price} AED
                      </Text>
                      <Text delete className="ml-2 text-gray-500">
                        {productData.actual_price} AED
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
                   
                  </Row>
                  <Paragraph className="mt-4">{description}</Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Card title={
                <Typography.Title level={3} className="font-bold text-2xl md:text-3xl">
                  {t('placeOrder.orderNow')}
                </Typography.Title>
              }>
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
                    rules={[
                      { required: true, message: t('placeOrder.mobileRequired') },
                      { validator: validateDubaiPhoneNumber }
                    ]}
                  >
                    <Input
                      addonBefore={
                        <div className="flex items-center w-[50px]">
                          <img
                            src="/—Pngtree—uae flag vector_13159076.png"
                            alt="UAE Flag"
                            className="w-4 mr-1"
                          />
                          +971
                        </div>
                      }
                      maxLength={9}
                      placeholder="50 XXX XXXX"
                    />
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
                      <Option value="dubai">Dubai</Option>
                      <Option value="abu_dhabi">Abu Dhabi</Option>
                      <Option value="sharjah">Sharjah</Option>
                      <Option value="ajman">Ajman</Option>
                      <Option value="fujairah">Fujairah</Option>
                      <Option value="ras_al_khaimah">Ras Al Khaimah</Option>
                      <Option value="umm_al_quwain">Umm Al Quwain</Option>
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
              
              {/* Updated Card for Product Description */}
              <Card className="mt-4">
                <Typography.Title level={4} className="font-bold text-xl md:text-2xl mb-4">
                  {t('placeOrder.description')}
                </Typography.Title>
                <Typography.Paragraph className="text-base md:text-lg">
                  {description}
                </Typography.Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default PlaceOrder;
