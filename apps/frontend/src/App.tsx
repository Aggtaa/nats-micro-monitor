import { Layout, theme } from 'antd'

import { Pages } from './pages'
import { Logo, Breadcrumb } from './components'

import './App.css'
import styles from './App.module.css'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Logo />
            </Header>

            <Content className={styles.Content}>
                <Breadcrumb />

                <div className="site-layout-content" style={{ background: colorBgContainer }}>
                    <Pages />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                NATS Micro Monitor v1.0.0
            </Footer>
        </Layout>
    )
}

export default App