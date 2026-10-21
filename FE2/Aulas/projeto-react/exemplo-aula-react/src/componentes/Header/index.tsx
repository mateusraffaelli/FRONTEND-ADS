const Header = ({ titulo }: {titulo: string}) => {

    return (
        <header>
            <nav className="navbar bg-1 fg-2">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="src/assets/react.svg" alt="Logo" width="30" height="24" className="d-inline-block align-text-top"/>
                            {titulo}
                    </a>
                </div>
            </nav>
        </header>
    )
}

export default Header