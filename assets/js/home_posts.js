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

          // // Initialize comment creation for the new post
          // createComment($("#new-comment-form-" + data.data.post._id)); // Assuming you have a form for comments with id `new-comment-form-{post._id}`
        },
        error: function (error) {
          console.log("error in sending data", error.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDom = function (post) {
    return $(`
          <li id="post-${post._id}">
        <div class="post-content">
          
          <small
            ><a class="delete-post-button" href="/posts/destroy/${post._id}"
              >X</a
            ></small
          >
         
        </div>
        ${post.content}
        <div class="post-user">
        ${post.user.name} 
        </div>
        <div class="post-comments">
         
        <form action="/comments/create" id="new-comment-form" method="POST">
            <input
              type="text"
              name="content"
              placeholder="Type here to add comment..."
            />
            <input type="hidden" name="postId" value="${post._id}" />
            <input type="submit" value="Add comment" />
          </form>

          <div id="post-comments-list">
            <ul id="post-comments-${post._id}">
            
  
            </ul>
          </div>
        </div>
      </li>
`);
  };

  //method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          new Noty({
            theme: "relax",
            text: "Post deleted successfully!",
            type: "success",
            layout: "topCenter",
            timeout: 1000,
            className: "custom-notification-class", // Add your custom class here
          }).show();
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  // Method to create a comment
  // let createComment = function (commentForm) {
  //   commentForm.submit(function (e) {
  //     e.preventDefault();
  //     $.ajax({
  //       type: "post",
  //       url: commentForm.attr("action"),
  //       data: commentForm.serialize(),
  //       success: function (data) {
  //         let newComment = newCommentDom(data.data.comment);
  //         let postId = data.data.comment.post;
  //         let commentsContainer = $(`#post-comments-${postId}`);
  //         commentsContainer.prepend(newComment);
  //         deleteComment($(" .delete-comment-button", newComment)); // Initialize delete for the new comment
  //       },
  //       error: function (error) {
  //         console.log("Error:", error.responseText);
  //       },
  //     });
  //   });
  // };

  // // Method to create a comment in the DOM
  // let newCommentDom = function (comment) {
  //   return $(`
  //     <li id="comment-${comment._id}">
  //       <p>
  //           <small>
  //             <a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a>
  //           </small>
  //         ${comment.content}
  //         <br />
  //         <small>${comment.user.name}</small>
  //       </p>
  //     </li>
  //   `);
  // };
  // // Method to delete a comment from the DOM
  // let deleteComment = function (deleteLink) {
  //   $(deleteLink).click(function (e) {
  //     e.preventDefault();

  //     $.ajax({
  //       type: "get",
  //       url: $(deleteLink).prop("href"),
  //       success: function (data) {
  //         new Noty({
  //           theme: "relax",
  //           text: "Comment deleted successfully!",
  //           type: "success",
  //           layout: "topCenter",
  //           timeout: 1000,
  //           className: "custom-notification-class",
  //         }).show();
  //         $(`#comment-${data.data.comment_id}`).remove();
  //       },
  //       error: function (error) {
  //         console.log(error.responseText);
  //       },
  //     });
  //   });
  // };

  // $(".delete-comment-button").each(function () {
  //   deleteComment($(this));
  // });

  // // Initialize comment creation for existing posts
  // $('form[id^="new-comment-form-"]').each(function () {
  //   createComment($(this));
  // });

  createPost();
}
