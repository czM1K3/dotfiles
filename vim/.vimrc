:set number
:set relativenumber

:nnoremap <A-k> <Up>ddp<Up>
:nnoremap <A-j> ddp

" Return to last edit position when opening files (You want this!)
autocmd BufReadPost *
     \ if line("'\"") > 0 && line("'\"") <= line("$") |
     \   exe "normal! g`\"" |
     \ endif
