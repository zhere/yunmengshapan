import { useParams } from 'react-router-dom';
import VideoPreview from './VideoPreview';

/**
 * 视频预览路由包装组件
 * 读取 :id 路由参数并传递给 VideoPreview 组件
 */
export default function VideoPreviewRoute() {
  const { id } = useParams();
  return <VideoPreview id={id} />;
}
