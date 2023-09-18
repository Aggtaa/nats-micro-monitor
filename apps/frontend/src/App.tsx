import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { Pages } from './pages'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" >
                    Nats Micro Monitor
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={[
                        {
                            key: '1',
                            label: 'Home',
                        },
                        {
                            key: '2',
                            label: 'List',
                        },
                        {
                            key: '3',
                            label: 'Status',
                        },
                        {
                            key: '4',
                            label: 'About',
                        },
                    ]}
                />
            </Header>

            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb
                    style={{ margin: '16px 0' }}
                    items={[
                        { title: 'Home' },
                        { title: 'List' },
                    ]}
                />

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