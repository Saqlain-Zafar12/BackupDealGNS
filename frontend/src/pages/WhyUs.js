import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Row, Col, Card } from 'antd';
import { CheckCircleOutlined, RocketOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const WhyUs = () => {
  const { t } = useTranslation();

  const reasons = [
    { icon: <CheckCircleOutlined className="text-green-500" />, title: t('whyUs.qualityProducts'), content: t('whyUs.qualityContent') },
    { icon: <RocketOutlined className="text-blue-500" />, title: t('whyUs.fastDelivery'), content: t('whyUs.deliveryContent') },
    { icon: <LockOutlined className="text-red-500" />, title: t('whyUs.securePayments'), content: t('whyUs.paymentsContent') },
    { icon: <StarOutlined className="text-yellow-500" />, title: t('whyUs.customerSatisfaction'), content: t('whyUs.satisfactionContent') },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Title level={1} className="text-center mb-12">{t('whyUs.title')}</Title>
        <Row gutter={[32, 32]}>
          {reasons.map((reason, index) => (
            <Col xs={24} md={12} key={index}>
              <Card hoverable className="h-full">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{reason.icon}</div>
                  <Title level={3}>{reason.title}</Title>
                </div>
                <Paragraph>{reason.content}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        <Card hoverable className="mt-12">
          <Title level={2} className="text-center mb-4">{t('whyUs.ourPromise')}</Title>
          <Paragraph className="text-center text-lg">{t('whyUs.promiseContent')}</Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default WhyUs;
