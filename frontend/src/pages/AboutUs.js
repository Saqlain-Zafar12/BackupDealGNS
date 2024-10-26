import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Row, Col, Card, List } from 'antd';
import { HeartOutlined, RocketOutlined, ShoppingOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  const { t } = useTranslation();

  const products = [
    { icon: <HeartOutlined />, title: t('aboutUs.skinCare') },
    { icon: <RocketOutlined />, title: t('aboutUs.hairCare') },
    { icon: <ShoppingOutlined />, title: t('aboutUs.beautyProducts') },
    { icon: <SafetyOutlined />, title: t('aboutUs.homeAppliances') },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Title level={1} className="text-center mb-12">{t('aboutUs.title')}</Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <Title level={3}>{t('aboutUs.ourStory')}</Title>
              <Paragraph>{t('aboutUs.storyContent')}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="h-full">
              <Title level={3}>{t('aboutUs.ourMission')}</Title>
              <Paragraph>{t('aboutUs.missionContent')}</Paragraph>
            </Card>
          </Col>
          <Col xs={24}>
            <Card hoverable>
              <Title level={3}>{t('aboutUs.ourProducts')}</Title>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 4 }}
                dataSource={products}
                renderItem={(item) => (
                  <List.Item>
                    <Card className="text-center">
                      {React.cloneElement(item.icon, { className: "text-4xl text-blue-500 mb-4" })}
                      <Paragraph strong>{item.title}</Paragraph>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card hoverable>
              <Title level={3}>{t('aboutUs.ourCommitment')}</Title>
              <Paragraph>{t('aboutUs.commitmentContent')}</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AboutUs;
