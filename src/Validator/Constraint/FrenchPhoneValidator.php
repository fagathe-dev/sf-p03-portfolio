<?php
declare(strict_types=1);

namespace App\Validator\Constraint;

use Symfony\Component\Intl\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class FrenchPhoneValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint): void
    {
        // 1. Sécurité : vérifier que la contrainte passée est bien la bonne
        if (!$constraint instanceof FrenchPhone) {
            throw new UnexpectedTypeException($constraint, FrenchPhone::class);
        }

        // 2. Ignorer les valeurs nulles ou vides
        // C'est une bonne pratique Symfony pour permettre l'utilisation de #[NotBlank] à côté
        if (null === $value || '' === $value) {
            return;
        }

        /**
         * 3. Expression régulière basée sur tes critères :
         * - ^(?:\+33[ .-]?|0) : Commence par +33 (suivi d'un séparateur optionnel) OU par un 0
         * - [1-9] : Suivi par un chiffre de 1 à 9 (couvre fixes 01-05, mobiles 06-07, spéciaux 08-09)
         * - (?:[ .-]?[0-9]{2}){4}$ : Suivi de 4 paires de chiffres, séparées optionnellement par un espace, point ou tiret
         */
        $pattern = '/^(?:\+33[ .-]?|0)[1-9](?:[ .-]?[0-9]{2}){4}$/';

        // 4. Si le format ne correspond pas, on lève la violation
        if (!preg_match($pattern, (string) $value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', (string) $value)
                ->addViolation();
        }
    }
}