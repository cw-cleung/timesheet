<div class="navbar-header">
  <a href="#"><img src="images/cubewise_logo_small.png" title="Your Logo Here" style="background-size:contain; height: 30px; margin-top:10px; margin-left: 10px;"></img></a>
</div>

<div ng-controller="topNavBarCtrl" >
  <ul class="nav navbar-nav top-menu">
    <li class=""><a class="menu-button" href="#">Home</a></li>
    <li ng-repeat="link in links">
      <a ng-if="link.children.length == 0" class="menu-button" href="./#/{{link.data.page}}">{{link.label}}</a>
      <a ng-if="link.children.length > 0" class="dropdown-toggle menu-button" data-toggle="dropdown" href="">{{link.label}} <b class="caret"></b></a>
      <ul ng-if="link.children.length > 0" class="dropdown-menu">
        <li ng-repeat="child in link.children"><a href="./#/{{child.data.page}}">{{child.label}}</a></li>
      </ul>
    </li>

  </ul>

</div>

