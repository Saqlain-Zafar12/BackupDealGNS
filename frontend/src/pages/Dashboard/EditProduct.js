import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, message, Space, Switch, Upload, Image, Layout } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { useCategory } from '../../context/CategoryContext';
import { useBrand } from '../../context/BrandContext';
import { useAttribute } from '../../context/AttributesContext';
import translate from 'translate';

const { Option } = Select;
const { TextArea } = Input;
const { Content } = Layout;

const EditProduct = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { updateProduct, getProductById, selectedProduct, setSelectedProduct } = useProduct();
  const { categories } = useCategory();
  const { brands } = useBrand();
  const { attributes } = useAttribute();
  const [loading, setLoading] = useState(false);
  const [mainImageFile, setMainImageFile] = useState([]);
  const [tabImageFiles, setTabImageFiles] = useState([]);
  const [removedTabImages, setRemovedTabImages] = useState([]);

  const [productMainImage, setProductMainImage] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setProductMainImage(product.image_url);
        let parsedAttributes = product.attributes;
        if (typeof product.attributes === 'string') {
          try {
            parsedAttributes = JSON.parse(product.attributes);
          } catch (error) {
            console.error('Error parsing attributes:', error);
            parsedAttributes = [];
          }
        }
        form.setFieldsValue({
          ...product,
          category_id: product.category_id,
          brand_id: product.brand_id,
          actual_price: parseFloat(product.actual_price),
          off_percentage_value: parseFloat(product.off_percentage_value),
          price: parseFloat(product.price),
          cost: parseFloat(product.cost),
          delivery_charges: parseFloat(product.delivery_charges),
          quantity: parseInt(product.quantity),
          sold: parseInt(product.sold),
          max_quantity_per_user: parseInt(product.max_quantity_per_user),
          is_deal: product.is_deal,
          is_hot_deal: product.is_hot_deal,
          vat_included: product.vat_included,
          attributes: parsedAttributes,
        });
        // Set existing images if available
        if (product.image_url) {
          setMainImageFile([{
            uid: '-1',
            name: product.image_url.split('\\').pop(),
            status: 'done',
            url: `${backendUrl}/${product.image_url}`
          }]);
        }
        if (Array.isArray(product.tabs_image_url)) {
          setTabImageFiles(product.tabs_image_url.map((url, index) => ({
            uid: `-${index}`,
            name: url.split('\\').pop(),
            status: 'done',
            url: `${backendUrl}/${url}`,
            isExisting: true // Add this flag to identify existing images
          })));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        message.error('Failed to fetch product details');
      }
    };
    fetchProduct();

    return () => setSelectedProduct(null);
  }, [id, form, getProductById, setSelectedProduct]);

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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = formatProductData(values);
      await updateProduct(id, formattedValues);
      message.success('Product updated successfully');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatProductData = (values) => {
    let formattedAttributes = [];
    if (typeof values.attributes === 'string') {
      try {
        formattedAttributes = JSON.parse(values.attributes);
      } catch (error) {
        console.error('Error parsing attributes:', error);
      }
    } else if (Array.isArray(values.attributes)) {
      formattedAttributes = values.attributes.filter(attr => 
        attr && attr.attribute_id && attr.values && attr.values.length > 0
      );
    }

    return {
      ...values,
      actual_price: parseFloat(values.actual_price),
      off_percentage_value: parseFloat(values.off_percentage_value),
      price: parseFloat(values.price),
      cost: parseFloat(values.cost),
      delivery_charges: parseFloat(values.delivery_charges),
      quantity: parseInt(values.quantity),
      max_quantity_per_user: parseInt(values.max_quantity_per_user),
      sold: parseInt(values.sold),
      attributes: formattedAttributes,
      mainImage: mainImageFile.length > 0 ? (mainImageFile[0].originFileObj || mainImageFile[0]) : productMainImage,
      image_url: productMainImage,
      tabImages: tabImageFiles.filter(file => !file.isExisting).map(file => file.originFileObj),
      tabs_image_url: tabImageFiles
        .filter(file => file.isExisting)
        .map(file => file.url?.replace(`${backendUrl}/`, '') || file.name),
      removedTabImages: removedTabImages,
      is_deal: values.is_deal || false,
      is_hot_deal: values.is_hot_deal || false,
      vat_included: values.vat_included === undefined ? true : values.vat_included
    };
  };

  const handleMainImageUpload = ({ fileList }) => {
    // Only keep the last uploaded file
    const newFileList = fileList.slice(-1);
    setMainImageFile(newFileList);
    setProductMainImage(null);  // Clear the initial image URL when a new image is uploaded
  };

  const handleRemoveMainImage = () => {
    setMainImageFile([]);
    setProductMainImage(null);  // Clear the initial image URL when the image is removed
  };

  const handleTabImagesUpload = ({ fileList }) => {
    // Filter out files that are being removed
    const newFiles = fileList.filter(file => file.status !== 'removed');
    
    // Identify removed existing images
    const removedExisting = tabImageFiles.filter(
      oldFile => oldFile.isExisting && !newFiles.some(newFile => newFile.uid === oldFile.uid)
    );
    
    setRemovedTabImages(prev => [...prev, ...removedExisting.map(file => file.name)]);

    // Update tabImageFiles with new state
    setTabImageFiles(newFiles);
  };

  const backendUrl = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000').replace(/\/api\/v1$/, '');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px', overflowY: 'auto' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
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

            <Form.Item name="mainImage" label="Main Image">
              <Upload
                listType="picture-card"
                fileList={mainImageFile}
                onChange={handleMainImageUpload}
                beforeUpload={() => false}
                maxCount={1}
                onRemove={handleRemoveMainImage}
              >
                {mainImageFile.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {mainImageFile.length > 0 && (
              <div style={{ marginTop: -24, marginBottom: 16 }}>
                <Button 
                  icon={<EditOutlined />} 
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  Replace Image
                </Button>
              </div>
            )}

            <Form.Item name="tabImages" label="Tab Images">
              <Upload
                listType="picture-card"
                fileList={tabImageFiles}
                onChange={handleTabImagesUpload}
                beforeUpload={() => false}
                multiple
                maxCount={5}
              >
                {tabImageFiles.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
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
                Update Product
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default EditProduct;