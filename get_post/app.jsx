var converter = new Showdown.converter();

var Button = ReactBootstrap.Button;

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handelCommitGet: function() {
    var pr = this.refs.pr.getDOMNode().value.trim();
    $.ajax({
      url: '/pr/'+pr,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
        console.error(JSON.stringify(data));
        //console.error(JSON.stringify(pr));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        {this.state.data}
        <input type="text" placeholder="PR Number" ref="pr" />
        <button onClick={this.handelCommitGet}>123</button>
        <p />
        <Button bsStyle='primary' onClick={this.handelCommitGet}>Get commit</Button>

      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <div key={index}>
          {comment.svn}
        </div>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});


React.render(
  <CommentBox url="commits.json" pollInterval={2000} />,
  document.getElementById('content')
);