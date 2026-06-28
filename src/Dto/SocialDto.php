<?php

declare(strict_types=1);

namespace App\Dto;

final class SocialDto
{
    public function __construct(
        public readonly string $name,
        public readonly string $icon,
        public readonly string $link,
    ) {
    }
}
