import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Row, Col, Card, List } from 'antd';
import { ExclamationCircleOutlined, QuestionCircleOutlined, FileProtectOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UnclaimableProducts = () => {
  const { t } = useTranslation();

  const examples = [
    t('unclaimableProducts.personalizedItems'),
    t('unclaimableProducts.intimateProducts'),
    t('unclaimableProducts.openedBeautyProducts'),
    t('unclaimableProducts.usedAppliances'),
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Title level={1} className="text-center mb-12">{t('unclaimableProducts.title')}</Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <QuestionCircleOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={3}>{t('unclaimableProducts.whatAreThey')}</Title>
              <Paragraph>{t('unclaimableProducts.explanation')}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <ExclamationCircleOutlined className="text-4xl text-yellow-500 mb-4" />
              <Title level={3}>{t('unclaimableProducts.examples')}</Title>
              <List
                dataSource={examples}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text>{item}</Typography.Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <FileProtectOutlined className="text-4xl text-green-500 mb-4" />
              <Title level={3}>{t('unclaimableProducts.ourPolicy')}</Title>
              <Paragraph>{t('unclaimableProducts.policyContent')}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <CustomerServiceOutlined className="text-4xl text-purple-500 mb-4" />
              <Title level={3}>{t('unclaimableProducts.customerSupport')}</Title>
              <Paragraph>{t('unclaimableProducts.supportContent')}</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UnclaimableProducts;
