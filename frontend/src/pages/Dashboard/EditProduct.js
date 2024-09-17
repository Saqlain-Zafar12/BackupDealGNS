import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, message, Space, Switch, Upload, Image } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { useCategory } from '../../context/CategoryContext';
import { useBrand } from '../../context/BrandContext';
import { useAttribute } from '../../context/AttributesContext';

const { Option } = Select;
const { TextArea } = Input;

const EditProduct = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { updateProduct, getProductById, selectedProduct, setSelectedProduct } = useProduct();
  const { categories } = useCategory();
  const { brands } = useBrand();
  const { attributes } = useAttribute();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [existingTabImages, setExistingTabImages] = useState([]);
  const [newTabImages, setNewTabImages] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        form.setFieldsValue({
          ...product,
          attributes: Array.isArray(product.attributes) ? product.attributes : [],
        });
        setExistingMainImage(product.image_url);
        setExistingTabImages(product.tabs_image_url || []);
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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedAttributes = Array.isArray(values.attributes) 
        ? values.attributes.filter(attr => attr && attr.attribute_id && attr.values && attr.values.length > 0)
        : [];

      const formattedValues = {
        ...values,
        actual_price: parseFloat(values.actual_price),
        off_percentage_value: parseFloat(values.off_percentage_value),
        price: parseFloat(values.price),
        delivery_charges: parseFloat(values.delivery_charges),
        quantity: parseInt(values.quantity),
        max_quantity_per_user: parseInt(values.max_quantity_per_user),
        sold: parseInt(values.sold),
        attributes: JSON.stringify(formattedAttributes),
        mainImage: mainImage,
        tabImages: newTabImages.map(file => `uploads\\${file.name}`),
        is_deal: values.is_deal || false,
        is_hot_deal: values.is_hot_deal || false,
        vat_included: values.vat_included || false,
        image_url: existingMainImage,
        tabs_image_url: JSON.stringify([...existingTabImages, ...newTabImages.map(file => `uploads\\${file.name}`)])
      };

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

  const handleMainImageUpload = (info) => {
    setMainImage(info.file);
  };

  const handleTabImagesUpload = ({ fileList }) => {
    const newImages = fileList.filter(file => file.originFileObj).map(file => file.originFileObj);
    setNewTabImages(newImages);
  };
  

  const handleRemoveMainImage = () => {
    setExistingMainImage(null);
    form.setFieldsValue({ image_url: null });
  };

  const handleRemoveTabImage = (index, isExisting = true) => {
    if (isExisting) {
      setExistingTabImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewTabImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const getImageUrl = (path) => {
    return `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/${path}`;
  };
  

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
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
        <Form.Item name="off_percentage_value" label="Discount Percentage" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            max={100}
            step={1}
            precision={2}
            style={{ width: '100%' }}
            onChange={handlePriceChange}
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
          <Input />
        </Form.Item>
        <Form.Item name="ar_title" label="Arabic Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="en_description" label="English Description" rules={[{ required: true }]}>
          <TextArea rows={4} />
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

        <Form.Item name="delivery_charges" label="Delivery Charges" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
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

        <Form.Item name="image_url" label="Main Image">
          {existingMainImage && (
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <Image
                width={200}
                src={getImageUrl(existingMainImage)}
                alt="Main Product Image"
              />
              <Button 
                icon={<CloseOutlined />} 
                onClick={handleRemoveMainImage}
                style={{ position: 'absolute', top: 0, right: 0 }}
              />
            </div>
          )}
          <Upload
            beforeUpload={() => false}
            onChange={handleMainImageUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload New Main Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="tabs_image_url" label="Tab Images">
          <Space style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            {existingTabImages.map((url, index) => (
              <div key={`existing-${index}`} style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
                <Image
                  width={100}
                  src={getImageUrl(url)}
                  alt={`Tab image ${index + 1}`}
                />
                <Button 
                  icon={<CloseOutlined />} 
                  onClick={() => handleRemoveTabImage(index, true)}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                />
              </div>
            ))}
            {newTabImages.map((file, index) => (
              <div key={`new-${index}`} style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
                <Image
                  width={100}
                  src={URL.createObjectURL(file)}
                  alt={`New tab image ${index + 1}`}
                />
                <Button 
                  icon={<CloseOutlined />} 
                  onClick={() => handleRemoveTabImage(index, false)}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                />
              </div>
            ))}
          </Space>
          <Upload
            beforeUpload={() => false}
            onChange={handleTabImagesUpload}
            multiple
            maxCount={5 - existingTabImages.length - newTabImages.length}
            fileList={newTabImages}
          >
            <Button icon={<UploadOutlined />}>Upload New Tab Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="is_deal" label="Is Deal" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="is_hot_deal" label="Is Hot Deal" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="vat_included" label="VAT Included" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;