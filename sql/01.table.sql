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
