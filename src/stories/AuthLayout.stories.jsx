import { AuthLayout } from '../components/ui/auth-layout';
// import { Button } from "@/components/button";
// import { Checkbox, CheckboxField } from "@/components/checkbox";
// import { Field, Label } from "@/components/fieldset";
// import { Heading } from "@/components/heading";
// import { Input } from "@/components/input";
// import { Strong, Text, TextLink } from "@/components/text";
// import { Logo } from "./logo";

export default {
  title: 'COMPONENTS/AuthLayout',
  component: AuthLayout,
};

export const Basic = () => (
  <AuthLayout>
    <div className="text-center text-zinc-800 dark:text-white">
      <h1>Test Content</h1>
      <p>This is a basic AuthLayout story.</p>
    </div>
  </AuthLayout>
);

// function Example() {
//   return (
//     <AuthLayout>
//       <form
//         action="#"
//         method="POST"
//         className="grid w-full max-w-sm grid-cols-1 gap-8"
//       >
//         <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
//         <Heading>Sign in to your account</Heading>
//         <Field>
//           <Label>Email</Label>
//           <Input type="email" name="email" />
//         </Field>
//         <Field>
//           <Label>Password</Label>
//           <Input type="password" name="password" />
//         </Field>
//         <div className="flex items-center justify-between">
//           <CheckboxField>
//             <Checkbox name="remember" />
//             <Label>Remember me</Label>
//           </CheckboxField>
//           <Text>
//             <TextLink href="#">
//               <Strong>Forgot password?</Strong>
//             </TextLink>
//           </Text>
//         </div>
//         <Button type="submit" className="w-full">
//           Login
//         </Button>
//         <Text>
//           Don’t have an account?{" "}
//           <TextLink href="#">
//             <Strong>Sign up</Strong>
//           </TextLink>
//         </Text>
//       </form>
//     </AuthLayout>
//   );
// }
