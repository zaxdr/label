import { FC } from "react";

interface IProps {
    title: string,
    width?: string | number,
    labelWidth?: string | number
}

const LabelItem: FC<IProps> = ({ title, width, children, labelWidth = 72 }) => {
    return <div style={{ width, paddingLeft: labelWidth }} className="dorabot-label-item">
        <span className="title" style={{ width: labelWidth }}>{title}:</span>
        <div className="label-box">{children}</div>
    </div>
}

export default LabelItem;