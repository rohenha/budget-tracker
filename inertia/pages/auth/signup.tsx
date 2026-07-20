import { Form } from '@adonisjs/inertia/react'
import { Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

export default function Signup() {
  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <Card>
        <CardHeader>
          <h1>Créer mon compte</h1>
          <p className="text-xs text-muted-foreground">
            Déjà un compte ?{' '}
            <Link
              route="session.create"
              className="underline underline-offset-4 hover:text-primary"
            >
              Se connecter
            </Link>
          </p>
        </CardHeader>
        <CardContent>
          <Form route="new_account.store">
            {({ errors }) => (
              <div className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Nom complet</FieldLabel>
                  <FieldContent>
                    <Input
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="John Doe"
                      aria-invalid={!!errors.fullName}
                    />
                    <FieldError errors={[{ message: errors.fullName }]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="john@example.com"
                      autoComplete="email"
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
                      placeholder="8 caractères minimum"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                    />
                    <FieldError errors={[{ message: errors.password }]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Confirmer le mot de passe</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      name="passwordConfirmation"
                      id="passwordConfirmation"
                      placeholder="Répétez le mot de passe"
                      autoComplete="new-password"
                      aria-invalid={!!errors.passwordConfirmation}
                    />
                    <FieldError errors={[{ message: errors.passwordConfirmation }]} />
                  </FieldContent>
                </Field>

                <Button type="submit" className="mt-2">
                  Créer mon compte
                </Button>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
