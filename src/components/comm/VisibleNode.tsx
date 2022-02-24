import React, { FC,useEffect, useState,useMemo} from 'react';

interface Props {
  visible?: boolean; //接收参数 是否显示
}

/**
 * 根据状态判断是否显示子节点
 * @param visible<boolean>
 * */
export default class VisibleNode extends React.Component<Props, any> {
  render() {
    const { visible = true } = this.props;
    if (visible === true) {
      return this.props.children
    } else {
      return null;
    }
  }
}

/**
   显示/影藏组件 
   visible true 显示 false 影藏
   第一次使用且visible是false时 不做渲染

 */
export const VisibleShowNode: FC<Props> = ({ visible, children }) => {
  //缓存状态
  const [cacheStatus, setCacheStatus] = useState<boolean>(true)

  //监听visible,bool 都为真时 取消缓存
  useEffect(() => {
    if (cacheStatus && visible) {
      setCacheStatus(false)
    }
  }, [visible, cacheStatus])

  const style = useMemo(() => {
    let value = visible === false ? 'none' : ''
    return {
      display: value
    }
  }, [visible])
  if (cacheStatus) return null;
  return <div style={style}>
    {children}
  </div>
}