export default function TopBar(){

    const items=[

        "01 Home",

        "02 Projects",

        "03 About",

        "04 Notes",

        "05 日本語"

    ];

    return(

        <header className="topbar">

            <div className="logo">

                NaranderOS

            </div>

            <nav className="nav">

                {

                    items.map(item=>

                        <button key={item}>

                            {item}

                        </button>

                    )

                }

            </nav>

        </header>

    )

}
