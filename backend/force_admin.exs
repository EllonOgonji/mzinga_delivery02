# Force Promote User 55 to Admin
{:ok, _} = Application.ensure_all_started(:ssl)
{:ok, _} = Application.ensure_all_started(:postgrex)
{:ok, _} = Application.ensure_all_started(:ecto_sql)

case MzingaDelivery.Repo.start_link() do
  {:ok, _} -> :ok
  {:error, {:already_started, _}} -> :ok
  error -> IO.inspect(error, label: "Repo start error")
end

alias MzingaDelivery.Repo
alias MzingaDelivery.Accounts.User
import Ecto.Query

user_id = 55
user = Repo.get(User, user_id)

if user do
  user
  |> Ecto.Changeset.change(role: "admin")
  |> Repo.update()

  IO.puts("Successfully forced User 55 (Machapo) to role: admin")
else
  IO.puts("User 55 not found")
end
