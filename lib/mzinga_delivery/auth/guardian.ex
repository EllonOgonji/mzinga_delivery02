defmodule MzingaDelivery.Auth.Guardian do
  use Guardian, otp_app: :mzinga_delivery

  alias MzingaDelivery.Accounts

  # Encode user ID into JWT token
  def subject_for_token(%{id: id}, _claims) do
    {:ok, to_string(id)}
  end

  def subject_for_token(_, _) do
    {:error, :no_id_provided}
  end

  # Decode JWT token and fetch user
  def resource_from_claims(%{"sub" => id}) do
    case Accounts.get_user(id) do
      nil -> {:error, :resource_not_found}
      user -> {:ok, user}
    end
  end

  def resource_from_claims(_claims) do
    {:error, :no_subject_provided}
  end
end
