import { useRouter } from 'next/router'
import { returnToList } from '../navigationState'

export default function ReturnToList({ className = 'ocean-return-list' }) {
  const router = useRouter()
  return (
    <button
      type='button'
      className={className}
      onClick={() => returnToList(router)}
      title='回到打开文章前的位置'
    >
      ← 返回文章列表
    </button>
  )
}
