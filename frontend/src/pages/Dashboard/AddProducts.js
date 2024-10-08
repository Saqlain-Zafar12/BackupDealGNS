import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Space, Switch, Upload, Layout, Image, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, LoadingOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { useCategory } from '../../context/CategoryContext';
import { useBrand } from '../../context/BrandContext';
import { useAttribute } from '../../context/AttributesContext';
import { useNavigate } from 'react-router-dom';
import translate from 'translate';

const { Option } = Select;
const { TextArea } = Input;
const { Content } = Layout;

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { addProduct, uploadImage } = useProduct();
  const { categories } = useCategory();
  const { brands } = useBrand();
  const { attributes } = useAttribute();
  const [loading, setLoading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [tabImageUrls, setTabImageUrls] = useState([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingTab, setUploadingTab] = useState(false);

  const calculateFinalPrice = (actualPrice, discountPercentage) => {
    const discount = (actualPrice * discountPercentage) / 100;
    return actualPrice - discount;
  };

  const handlePriceChange = () => {
    const actualPrice = form.getFieldValue('actual_price');
    const discountPercentage = form.getFieldValue('off_percentage_value');
    if (actualPrice && discountPercentage) {
      const calculatedFinalPrice = calculateFinalPrice(actualPrice, discountPercentage);
      form.setFieldsValue({ price: parseFloat(calculatedFinalPrice.toFixed(2)) });
    }
  };

  const translateText = async (text, targetLang) => {
    try {
      const translatedText = await translate(text, { to: targetLang });
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return '';
    }
  };

  const handleEnglishInputChange = async (e, field) => {
    const englishValue = e.target.value;
    if (englishValue) {
      const arabicValue = await translateText(englishValue, 'ar');
      form.setFieldsValue({ [`ar_${field.split('en_')[1]}`]: arabicValue });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      en_title: '',
      ar_title: '',
      en_description: '',
      ar_description: ''
    });
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Starting to format product data');
      const formattedValues = formatProductData(values);
      console.log('Formatted product data:', formattedValues);
      console.log('Calling addProduct function');
      await addProduct(formattedValues);
      console.log('Product added successfully');
      message.success('Product added successfully');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Failed to add product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatProductData = (values) => {
    const formattedAttributes = Array.isArray(values.attributes) 
      ? values.attributes.filter(attr => attr && attr.attribute_id && attr.values && attr.values.length > 0)
      : [];

    // Create a new object without tabImages and mainImage
    const {tabImages, mainImage, ...restValues} = values;

    return {
      ...restValues,
      actual_price: parseFloat(values.actual_price),
      off_percentage_value: parseFloat(values.off_percentage_value),
      price: parseFloat(values.price),
      delivery_charges: parseFloat(values.delivery_charges),
      quantity: parseInt(values.quantity),
      max_quantity_per_user: parseInt(values.max_quantity_per_user),
      sold: parseInt(values.sold),
      attributes: formattedAttributes,
      image_url: mainImageUrl,
      tabs_image_url: tabImageUrls,
      is_deal: values.is_deal || false,
      is_hot_deal: values.is_hot_deal || false,
      vat_included: values.vat_included === undefined ? true : values.vat_included
    };
  };

  const handleMainImageUpload = async (info) => {
    const { status, originFileObj } = info.file;
    if (status === 'uploading') {
      setUploadingMain(true);
      return;
    }
    if (status === 'done') {
      try {
        const url = await uploadImage(originFileObj);
        setMainImageUrl(url);
        message.success(`${info.file.name} file uploaded successfully`);
      } catch (error) {
        message.error(`${info.file.name} file upload failed.`);
      } finally {
        setUploadingMain(false);
      }
    }
  };

  const handleTabImagesUpload = async (info) => {
    const { status, originFileObj } = info.file;
    if (status === 'uploading') {
      setUploadingTab(true);
      return;
    }
    if (status === 'done') {
      try {
        console.log('Uploading image:', originFileObj);
        const url = await uploadImage(originFileObj);
        console.log('Image uploaded successfully:', url);
        setTabImageUrls(prev => [...prev, url]);
        message.success(`${info.file.name} file uploaded successfully`);
      } catch (error) {
        console.error('Error uploading image:', error);
        message.error(`${info.file.name} file upload failed.`);
      } finally {
        setUploadingTab(false);
      }
    }
  };

  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const handleDelete = (url) => {
    if (url === mainImageUrl) {
      setMainImageUrl(null);
      form.setFieldsValue({ mainImage: undefined });
    } else {
      setTabImageUrls(prev => prev.filter(u => u !== url));
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px', overflowY: 'auto' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
          <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ attributes: [], vat_included: true }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select a category">
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.en_category_name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="brand_id" label="Brand" rules={[{ required: true }]}>
                <Select placeholder="Select a brand">
                  {brands.map(brand => (
                    <Option key={brand.id} value={brand.id}>{brand.en_brand_name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="actual_price" label="Actual Price" rules={[{ required: true }]}>
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  onChange={handlePriceChange}
                />
              </Form.Item>
              <Form.Item name="off_percentage_value" label="Discount Percentage" rules={[
                { required: true },
                { type: 'number', min: 0, max: 100, message: 'Please enter a number between 0 and 100' }
              ]}>
                <InputNumber
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  style={{ width: '100%' }}
                  onChange={handlePriceChange}
                  parser={value => Number(value)}
                />
              </Form.Item>
              <Form.Item name="price" label="Final Price" rules={[{ required: true }]}>
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item name="en_title" label="English Title" rules={[{ required: true }]}>
                <Input onChange={(e) => handleEnglishInputChange(e, 'en_title')} />
              </Form.Item>
              <Form.Item name="ar_title" label="Arabic Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="cost" label="Cost" rules={[{ required: true }, { type: 'number' }]}>
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  type="number"
                  parser={value => Number(value)}
                />
              </Form.Item>
            </div>
            <Form.Item name="en_description" label="English Description" rules={[{ required: true }]}>
              <TextArea rows={4} onChange={(e) => handleEnglishInputChange(e, 'en_description')} />
            </Form.Item>
            <Form.Item name="ar_description" label="Arabic Description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>

            <Form.List name="attributes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" direction="vertical">
                      <Space>
                        <Form.Item
                          {...restField}
                          name={[name, 'attribute_id']}
                          rules={[{ required: true, message: 'Missing attribute' }]}
                        >
                          <Select style={{ width: 130 }} placeholder="Attribute">
                            {attributes.map(attr => (
                              <Option key={attr.id} value={attr.id}>{attr.en_attribute_name}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                      <Form.List name={[name, 'values']}>
                        {(subFields, subOps) => (
                          <>
                            {subFields.map((subField, index) => (
                              <Space key={subField.key}>
                                <Form.Item
                                  {...subField}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: "Please input attribute value or delete this field.",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input placeholder="English-Arabic value" style={{ width: '60%' }} />
                                </Form.Item>
                                {subFields.length > 1 ? (
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => subOps.remove(subField.name)}
                                  />
                                ) : null}
                              </Space>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => subOps.add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add value
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Attribute
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Form.Item name="delivery_charges" label="Delivery Charges" rules={[{ required: true }, { type: 'number' }]}>
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  keyboard={false}
                  type="number"
                />
              </Form.Item>
              <Form.Item name="quantity" label="Total Quantity" rules={[{ required: true }]}>
                <InputNumber
                  min={0}
                  step={1}
                  precision={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item name="sold" label="Sold Items" rules={[{ required: true }]}>
                <InputNumber
                  min={0}
                  step={1}
                  precision={0}
                  style={{ width: '100%' }}
                  type="number"
                  keyboard={false}
                  inputMode="numeric"
                  onKeyDown={(e) => {
                    if (e.key === '.' || e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
              <Form.Item name="max_quantity_per_user" label="Max Quantity Per User" rules={[{ required: true }]}>
                <InputNumber
                  min={1}
                  step={1}
                  precision={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            <Form.Item name="mainImage" label="Main Image" rules={[{ required: true }]}>
              <Upload
                accept="image/*"
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                onChange={handleMainImageUpload}
                maxCount={1}
                listType="picture-card"
                showUploadList={false}
              >
                {mainImageUrl ? (
                  <div style={{ position: 'relative' }}>
                    <img src={mainImageUrl} alt="Main" style={{ width: '100%' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0 }}>
                      <Button 
                        icon={<EyeOutlined />} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(mainImageUrl);
                        }}
                      />
                      <Button 
                        icon={<DeleteOutlined />} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(mainImageUrl);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {uploadingMain ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item name="tabImages" label="Tab Images">
              <Upload
                accept="image/*"
                customRequest={({ file, onSuccess, onError }) => {
                  handleTabImagesUpload({ file: { ...file, status: 'done', originFileObj: file } })
                    .then(() => onSuccess('ok'))
                    .catch(error => onError(error));
                }}
                multiple
                maxCount={5}
                listType="picture-card"
                fileList={tabImageUrls.map((url, index) => ({
                  uid: `-${index}`,
                  name: `image-${index}`,
                  status: 'done',
                  url: url,
                }))}
                onPreview={(file) => handlePreview(file.url)}
                onRemove={(file) => handleDelete(file.url)}
              >
                {tabImageUrls.length >= 5 ? null : (
                  <div>
                    {uploadingTab ? <LoadingOutlined /> : <UploadOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Form.Item name="is_deal" label="Is Deal" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="is_hot_deal" label="Is Hot Deal" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="vat_included" label="VAT Included" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Product
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Modal
        visible={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Layout>
  );
};

export default AddProduct;