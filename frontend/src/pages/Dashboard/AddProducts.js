import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Space, Switch, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { useCategory } from '../../context/CategoryContext';
import { useBrand } from '../../context/BrandContext';
import { useAttribute } from '../../context/AttributesContext';

const { Option } = Select;
const { TextArea } = Input;

const AddProduct = () => {
  const [form] = Form.useForm();
  const { addProduct } = useProduct();
  const { categories } = useCategory();
  const { brands } = useBrand();
  const { attributes } = useAttribute();
  const [loading, setLoading] = useState(false);

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
        en_attributes: values.en_attributes?.map(attr => ({
          ...attr,
          values: attr.values.split(',').map(v => v.trim())
        })) || [],
        ar_attributes: values.ar_attributes?.map(attr => ({
          ...attr,
          values: attr.values.split(',').map(v => v.trim())
        })) || [],
        tabs_image_url: { tab1: values.tab1_image_url },
        is_deal: values.is_deal || false,
        is_hot_deal: values.is_hot_deal || false,
        vat_included: values.vat_included || false
      };
      await addProduct(formattedValues);
      message.success('Product added successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to add product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
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
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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
                  <Form.Item
                    {...restField}
                    name={[name, 'values']}
                    rules={[{ required: true, message: 'Missing values' }]}
                  >
                    <Input placeholder="Values (comma-separated)" style={{ width: 200 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
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
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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
                  <Form.Item
                    {...restField}
                    name={[name, 'values']}
                    rules={[{ required: true, message: 'Missing values' }]}
                  >
                    <Input placeholder="Values (comma-separated)" style={{ width: 200 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
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
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;