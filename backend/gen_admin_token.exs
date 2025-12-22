# Generate Token for Admin
{:ok, _} = Application.ensure_all_started(:ssl)
{:ok, _} = Application.ensure_all_started(:postgrex)
{:ok, _} = Application.ensure_all_started(:ecto_sql)
{:ok, _} = MzingaDelivery.Repo.start_link()

alias MzingaDelivery.Repo
alias MzingaDelivery.Accounts.User
alias MzingaDelivery.Auth.Guardian
import Ecto.Query

admin = Repo.one(from u in User, where: u.role == "admin", limit: 1)

if admin do
  {:ok, token, _claims} = Guardian.encode_and_sign(admin)
  IO.puts(token)
else
  IO.puts("No admin found")
end
