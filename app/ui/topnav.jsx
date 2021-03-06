var TopNav = React.createClass({
  componentDidMount: function(){
    $(".button-collapse").sideNav({
      edge: 'left',
      closeOnClick: true
    });
    $(".dropdown-button").dropdown();
  },
  render: function() {
    return (
      <div className="navbar-fixed">
        <nav className=" grey lighten-4">
          <div className="nav-wrapper-white nav-text-links">
            <ul className="pills right hide-on-med-and-dow">
              <li className="about-pill"><a href="#about">Home</a></li>
              <li className="bookmarks-pill"><a href="#bookmarks">Notebooks</a></li>
              <li><a href="#about"><i className="material-icons">school</i></a></li>
              <li><a href="#about"><i className="material-icons">notifications_none</i></a></li>
              <li>
                <a href="#user-dropdow" className="navbar-img dropdown-button" data-activates="user-dropdown">
                  <img className="mod-round" src={this.props.picUrl}/>
                </a>
                <ul id="user-dropdown" className="dropdown-content">
                  <li><a href="#!">New Bookmark</a></li>
                  <li><a href="#!">New Notebook</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Profile</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Log out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});
