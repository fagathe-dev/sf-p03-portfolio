<?php

declare(strict_types=1);

namespace App\Validator\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Contrainte de validation pour un numéro de téléphone au format français.
 *
 * Accepte :
 *   06 12 34 56 78 | 0612345678 | +33 6 12 34 56 78 | +33612345678
 *   Séparateurs : espace, point, tiret (ou aucun)
 *   Couvre : mobiles 06/07, fixes métropole 01-05, numéros spéciaux 08/09
 */
#[\Attribute(\Attribute::TARGET_PROPERTY)]
class FrenchPhone extends Constraint
{
    public string $message = 'Le numéro "{{ value }}" n\'est pas un numéro de téléphone français valide. '
        . 'Exemple attendu : 06 12 34 56 78 ou +33 6 12 34 56 78.';
}
