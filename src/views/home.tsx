
import { Col, Row } from "antd"
import LeftComponent from "./left";
import RightComponent from "./right";
import ContentComponent from "./content";
//标签打印组件
const HomeComponent = () => {
  return <div>
    <Row className="label-context">
      <Col span={6}>
        <LeftComponent />
      </Col>
      <Col span={12}>
        <ContentComponent />
      </Col>
      <Col span={6} className="dora-card">
        <RightComponent />
      </Col>
    </Row>
  </div>
}
export default HomeComponent

