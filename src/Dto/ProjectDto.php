<?php

declare(strict_types=1);

namespace App\Dto;

final class ProjectDto
{
    /** Libellé du bouton de démo quand le JSON ne précise pas `live_label` */
    public const string DEFAULT_LIVE_LABEL = 'Essayer';

    /**
     * @param string[]    $stack
     * @param string|null $live_label Libellé du bouton vers `live_link` (ex. « Explorer » pour une
     *                                documentation) ; null ou absent : DEFAULT_LIVE_LABEL
     */
    public function __construct(
        public readonly string $id,
        public readonly string $slug,
        public readonly string $name,
        public readonly ?string $thumbnail,
        public readonly array $stack,
        public readonly string $description,
        public readonly string $excerpt,
        public readonly string $date,
        public readonly ?string $github = null,
        public readonly ?string $live_link = null,
        public readonly ?string $live_label = null,
    ) {
    }

    /**
     * Libellé à afficher sur le bouton de démo, jamais vide.
     */
    public function getLiveLabel(): string
    {
        $label = trim($this->live_label ?? '');

        return '' !== $label ? $label : self::DEFAULT_LIVE_LABEL;
    }
}
