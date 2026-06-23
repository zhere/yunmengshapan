import { useParams } from 'react-router-dom';
import VideoPlayback from './VideoPlayback';

/**
 * 视频回放路由包装组件
 * 读取 :id 路由参数并传递给 VideoPlayback 组件
 */
export default function VideoPlaybackRoute() {
  const { id } = useParams();
  return <VideoPlayback id={id} />;
}
