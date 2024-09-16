import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, message, Space, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { useCategory } from '../../context/CategoryContext';
import { useBrand } from '../../context/BrandContext';
import { useAttribute } from '../../context/AttributesContext';

const { Option } = Select;
const { TextArea } = Input;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { getProductById, updateProduct } = useProduct();
  const { categories } = useCategory();
  const { brands } = useBrand();
  const { attributes } = useAttribute();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        form.setFieldsValue({
          ...product,
          en_attributes: product.en_attributes.map(attr => ({
            ...attr,
            values: attr.values || []
          })),
          ar_attributes: product.ar_attributes.map(attr => ({
            ...attr,
            values: attr.values || []
          }))
        });
      } catch (error) {
        message.error('Failed to fetch product details');
        navigate('/dashboard/products');
      }
    };
    fetchProduct();
  }, [id, form, getProductById, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        actual_price: parseFloat(values.actual_price),
        off_percentage_value: parseFloat(values.off_percentage_value),
        price: parseFloat(values.price),
        delivery_charges: parseFloat(values.delivery_charges),
        quantity: parseInt(values.quantity),
        en_attributes: values.en_attributes || [],
        ar_attributes: values.ar_attributes || [],
        tabs_image_url: { tab1: values.tab1_image_url },
        is_deal: values.is_deal || false,
        is_hot_deal: values.is_hot_deal || false,
        vat_included: values.vat_included || false
      };
      await updateProduct(id, formattedValues);
      message.success('Product updated successfully');
      navigate('/dashboard/products');
    } catch (error) {
      message.error('Failed to update product: ' + error.message);
    } finally {
      setLoading(false);
    }
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
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="off_percentage_value" label="Discount Percentage" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="price" label="Final Price" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
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

        <Form.List name="en_attributes">
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
                              <Input placeholder="Attribute value" style={{ width: '60%' }} />
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
                  Add English Attribute
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.List name="ar_attributes">
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
                          <Option key={attr.id} value={attr.id}>{attr.ar_attribute_name}</Option>
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
                              <Input placeholder="Attribute value" style={{ width: '60%' }} />
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
                  Add Arabic Attribute
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="delivery_charges" label="Delivery Charges" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="image_url" label="Image URL" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tab1_image_url" label="Tab 1 Image URL">
          <Input />
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