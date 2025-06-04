import { CheckoutForm } from "@/features/checkout/ui";
import { Container } from "@/global-ui";
import { FormContainer } from "@/global-ui/form-reuseble/FormContainer";
export default function MyCheckoutPage() {
    return (
        <div className="bg-white">
            <Container>
                <FormContainer
                    formContent={<CheckoutForm />}
                />
            </Container>
        </div>

    );
}