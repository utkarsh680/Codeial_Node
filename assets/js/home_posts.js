{
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),

        success: function (data) {
          new Noty({
            theme: "relax",
            text: "Post created successfully!",
            type: "success",
            layout: "topCenter",
            timeout: 1000,
            className: "custom-notification-class", // Add your custom class here
          }).show();
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
        },
        error: function (error) {
          console.log("error in sending data", error.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
        <p>
            <small>
            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
            ${post.content}
            <br />
            <small><i>${post.user.name}
        </i></small>
        </p>

        <div class="post-comments">
           
            <form action="/comments/create" method="POST">
            <input
                type="text"
                name="content"
                required
                placeholder="typehere to add comment...."
            />
            <input type="hidden" name="post" value="${post._id}" />
            <input type="submit" value="add comment" />
            </form>

          
            <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
            </ul>
            </div>
        </div>
        </li>
`);
  };
  createPost();
}
