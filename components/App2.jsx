import dynamic from 'next/dynamic'
const App = dynamic(() => import('../components/App2'), { ssr: false })
export default function Home() { return <App /> }
