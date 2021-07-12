CREATE TABLE public.block_types
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    type character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT block_types_pkey PRIMARY KEY (id)
)

CREATE TABLE public.blocks
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    md text COLLATE pg_catalog."default" NOT NULL,
    twig text COLLATE pg_catalog."default" NOT NULL,
    type integer NOT NULL,
    yaml text COLLATE pg_catalog."default" NOT NULL,
    html text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT blocks_pkey PRIMARY KEY (id),
    CONSTRAINT blocks_type_fk FOREIGN KEY (type)
        REFERENCES public.block_types (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)