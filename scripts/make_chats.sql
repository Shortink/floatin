-- Create a new direct chat
insert into chats (is_group, name)
values (false, null)
returning id;

-- copy returned chat_id and run this script:
insert into chat_members (chat_id, user_id)
values
  ('chat_id_here', 'user1_id_here'),
  ('chat_id_here', 'user2_id_here');
