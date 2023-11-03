/** 観客データ */
CREATE table visitor (
  id BIGSERIAL NOT NULL,
  name varchar(255) not null,
  category text not null,
  start_at timestamp not null,
  end_at timestamp not null,
  identifier text not null,
  code text not null,
  PRIMARY KEY (id)
);

/** 名札持ち */
CREATE table badgeholder (
  id BIGSERIAL NOT NULL,
  name varchar(255) not null,
  category text not null,
  start_at timestamp not null,
  end_at timestamp not null,
  identifier text not null,
  code text not null,
  PRIMARY KEY (id)
);

/** 受付済みユーザー */
CREATE table accepted (
  id BIGSERIAL NOT NULL,
  name varchar(64) not null,
  category varchar(64) not null,
  code varchar(64) not null,
  timestamp timestamp default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
