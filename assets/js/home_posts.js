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
  createPost();
}
