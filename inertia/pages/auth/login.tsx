import { Form, Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

export default function Login() {
  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <Card>
        <CardHeader>
          <h1>Connexion</h1>
          <p className="text-xs text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link
              route="new_account.create"
              className="underline underline-offset-4 hover:text-primary"
            >
              Créer un compte
            </Link>
          </p>
        </CardHeader>
        <CardContent>
          <Form route="session.store">
            {({ errors }) => (
              <div className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="john@example.com"
                      autoComplete="username"
                      aria-invalid={!!errors.email}
                    />
                    <FieldError errors={[{ message: errors.email }]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Mot de passe</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Votre mot de passe"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                    />
                    <FieldError errors={[{ message: errors.password }]} />
                  </FieldContent>
                </Field>

                <Button type="submit" className="mt-2">
                  Se connecter
                </Button>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
