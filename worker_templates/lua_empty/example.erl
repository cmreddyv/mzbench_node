[ {make_install,
    [ {git, {var, "mzbench_repo", "https://github.com/mzbench/mzbench"}},
      {dir, "workers/lua"}]},
  {pool,
    [{size, 3},
         {worker_type, lua, lua}],
    [{main}]}
].