// UI TESTING FUNC
function do_test_with_ui_vals(success_threshold, time_min, time_max) {
  console.log("[TEST] SETTING UI VALS");
  console.log(`[TEST] UI SUCCESS THRESHOLD[${success_threshold}]`);
  console.log(`[TEST] UI TIME MIN/MAX[${time_min},${time_max}]`);

  // SET THE VALS
  success_threshold_ui = parseFloat(success_threshold) / 100.0;
  time_min_ui = parseInt(time_min);
  time_max_ui = parseInt(time_max);

  // TEST THE SEQ & PARALLEL
  fetchSequential()
    .then(() => fetchParallel())
    .then(() => getUserContent());
}

// SUCCESS THRESHOLD, HIGHER THRESHOLD MEANS LESS CHANCE FOR SUCCESS
const SUCCESS_THRESHOLD = 0.5;
let success_threshold_ui = -1.0;

function calc_rand_success() {
  // USE DYNAMIC SUCCESS THRESH FROM UI
  let succ_thresh =
    success_threshold_ui >= 0 ? success_threshold_ui : SUCCESS_THRESHOLD;
  let rand_val = Math.random();
  let succ_result = rand_val > succ_thresh;
  console.log(
    `      [RAND] USING SUCCESS THRESH[${succ_thresh}] RAND_VAL[${rand_val.toFixed(
      2
    )}] RESULT[${succ_result}]`
  );
  return succ_result;
}

// RAND TIME RANGE
// QUICK
const TIME_MIN = 500;
const TIME_MAX = 3000;

let time_min_ui = -1.0;
let time_max_ui = -1.0;

function calc_rand_time() {
  // DYNAMIC TIME RANGE FROM UI
  let rand_time;

  if (time_min_ui >= 0 && time_max_ui >= 0) {
    rand_time = time_min_ui + Math.random() * time_max_ui;

    console.log(
      `      [RAND] USING UI MIN_TIME[${time_min_ui}] MAX_TIME[${time_max_ui}] RAND_TIME[${rand_time.toFixed(2)}]`
    );
  } else {
    rand_time = TIME_MIN + Math.random() * TIME_MAX;

    console.log(
      `      [RAND] USING CONST MIN_TIME[${TIME_MIN}] MAX_TIME[${TIME_MAX}] RAND_TIME[${rand_time.toFixed(2)}]`
    );
  }

  return rand_time;
}

// FETCHUSER
const fetchUser = (call_type) => {
  console.log(`   [FETCH_U][${call_type}] START`);
  return new Promise((resolve, reject) => {
    // PRETEND NETWORK WAIT
    let wait_time = calc_rand_time();
    console.log(
      `   [FETCH_U][${call_type}] WAIT[${(wait_time / 1000).toFixed(
        1
      )}s] - BEGIN`
    );

    setTimeout(() => {
      console.log(`   [FETCH_U][${call_type}] WAIT - FINISHED`);

      // SUCC/FAIL
      if (calc_rand_success()) {
        console.log(`   [FETCH_U][${call_type}] SUCCESS!`);
        resolve({ id: 1, name: "Alice" });
      } else {
        console.log(`   [FETCH_U][${call_type}] FAIL!`);
        reject(`[FETCH_U][${call_type}] FAIL`);
      }
    }, wait_time);
    console.log(
      `   [FETCH_U][${call_type}] FINISHED (now waiting on promise resolve or reject)`
    );
  });
};

// FETCHPOSTS
const fetchPosts = (call_type, userId) => {
  console.log(`   [FETCH_P][${call_type}] START`);

  // PRETEND NETWORK WAIT
  let wait_time = calc_rand_time();
  console.log(
    `   [FETCH_P][${call_type}] WAIT[${(wait_time / 1000).toFixed(1)}s] - BEGIN`
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`   [FETCH_P][${call_type}] WAIT - FINISH`);

      // SUCC/FAIL
      if (calc_rand_success()) {
        console.log(`   [FETCH_P][${call_type}] SUCCESS!`);
        resolve([
          { id: 101, title: "JavaScript Async", userId },
          { id: 102, title: "Promises and Callbacks", userId },
        ]);
      } else {
        console.log(`   [FETCH_P][${call_type}] FAIL!`);
        reject(`[FETCH_P][${call_type}] FAIL`);
      }
    }, wait_time);
  });
};

// FETCHCOMMENTS
const fetchComments = (call_type, postId) => {
  console.log(`   [FETCH_C][${call_type}] POSTID[${postId}] START`);

  // PRETEND NETWORK WAIT
  let wait_time = calc_rand_time();
  console.log(
    `   [FETCH_C][${call_type}] POSTID[${postId}] WAIT[${(
      wait_time / 1000
    ).toFixed(1)}s] - BEGIN`
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`   [FETCH_C][${call_type}] POSTID[${postId}] WAIT - FINISH`);

      // SUCC/FAIL
      if (calc_rand_success()) {
        console.log(`   [FETCH_C][${call_type}] POSTID[${postId}] SUCCESS!`);
        resolve([
          { id: 201, text: "Great post!", postId },
          { id: 202, text: "Very informative.", postId },
        ]);
      } else {
        console.log(`   [FETCH_C][${call_type}] POSTID[${postId}] FAIL!`);
        reject(`[FETCH_C][${call_type}] POSTID[${postId}] FAIL`);
      }
    }, wait_time);
  });
};

// FETCHSEQUENTIAL
async function fetchSequential() {
  console.log("-");
  console.log("-");
  let seq_time_start = Date.now();
  console.log(`[FETCHSEQUENTIAL] START AT[${seq_time_start}]`);

  try {
    console.log(`   [FETCH_U][SEQ] CALLING...`);
    const user = await fetchUser("SEQ");
    console.log("   [FETCH_U][SEQ] GOT:", user);

    console.log(`   [FETCH_P][SEQ] CALLING...`);
    const posts = await fetchPosts("SEQ", user.id);
    console.log(`   [FETCH_P][SEQ] GOT`, posts);

    console.log(`   [FETCH_C][SEQ] CALLING...`);
    const comments = await Promise.all(
      posts.map((post) => fetchComments("SEQ", post.id))
    );
    console.log(`   [FETCH_C][SEQ] GOT:`, comments);

    return { user, posts, comments };
  } catch (error) {
    console.error(`[FETCHSEQUENTIAL] ERROR[${error}]`);
  }

  let seq_time_diff = Date.now() - seq_time_start;
  let dur_seconds = seq_time_diff / 1000;
  console.log(`[FETCHSEQUENTIAL] FINISHED AT[${dur_seconds.toFixed(1)}]`);
  console.log("-");
}

// FETCHPARALLEL USING ASYNC
async function fetchParallel() {
  console.log("-");
  console.log("-");
  let par_time_start = Date.now();
  console.log(`[FETCHPARALLEL] STARTED AT[${par_time_start}]`);

  try {
    const [user, posts, comments] = await Promise.all([
      fetchUser("PAR"),
      fetchPosts("PAR", 1),
      fetchComments("PAR", 101),
    ]);

    console.log("[FETCHPARALLEL] GOT USER:", user);
    console.log("[FETCHPARALLEL] GOT POSTS:", posts);
    console.log("[FETCHPARALLEL] GOT COMMENTS:", comments);

    return { user, posts, comments };
  } catch (error) {
    console.error(`[FETCHPARALLEL] ERROR[${error}]`);
  }

  let par_time_diff = Date.now() - par_time_start;
  let dur_seconds = par_time_diff / 1000;
  console.log(`[FETCHPARALLEL] FINISHED AT[${dur_seconds.toFixed(1)}]`);
}

// MAKE THE CHAINED GET USERCONTENT
async function getUserContent() {
  console.log("[GETUSERCONTENT] START GET REUSING SEQ FETCH FUNC...");
  const result = await fetchSequential();
  console.log("[GETUSERCONTENT] FINISHED...");
  console.log(`[GETUSERCONTENT] GOT`, result);
}
