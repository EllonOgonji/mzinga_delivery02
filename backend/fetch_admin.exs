# Fetch admin user
{:ok, _} = Application.ensure_all_started(:ssl)
{:ok, _} = Application.ensure_all_started(:postgrex)
{:ok, _} = Application.ensure_all_started(:ecto_sql)
{:ok, _} = MzingaDelivery.Repo.start_link()

alias MzingaDelivery.Repo
alias MzingaDelivery.Accounts.User
import Ecto.Query

admin = Repo.one(from u in User, where: u.role == "admin", limit: 1)

if admin do
  IO.puts("Admin Email: #{admin.email}")
else
  IO.puts("No admin found. Promoting User 55 (Machapo)...")
  user = Repo.get(User, 55)

  if user do
    user
    |> Ecto.Changeset.change(role: "admin")
    |> Repo.update()

    IO.puts("Promoted Machapo (User 55) to Admin.")
  else
    IO.puts("User 55 not found.")
  end
end
