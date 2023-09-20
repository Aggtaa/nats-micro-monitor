import { Layout, theme } from 'antd'
import { Breadcrumb } from './components/Breadcrumb'
import { Pages } from './pages'
import { HeaderMenu } from './components/HeaderMenu'
import { Logo } from './components/Logo'

import './App.css'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Logo />

                <HeaderMenu />
            </Header>

            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb />

                <div className="site-layout-content" style={{ background: colorBgContainer }}>
                    <Pages />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                Nats Micro Monitor v1.0.0
            </Footer>
        </Layout>
    )
}

export default App