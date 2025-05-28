import { CheckoutForm } from "@/features/checkout/ui";
import { Container } from "@/global-ui";
import { FormContainer } from "@/global-ui/form-reuseble/FormContainer";
export default function MyCheckoutPage() {
    return (
        <Container>
            <FormContainer
                formContent={<CheckoutForm />}
            />
        </Container>
    );
}