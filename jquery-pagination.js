(function( $ ) {
    $.fn.Paginate = function(options) {
        var page_pointer, // starts at 0, points to the current page.
            item_count, // Number of items to paginate. This counts the opts.data_element.
            item_pointer, // starts at 0, points to the first item of the current page. 
            page_count, // Number of pages
            self = $(this), // refers to the data container
            defaults = {
                data_element: 'li', 
                pag_element: null,
                pag_nav_el : '<a class="pagination_page" href="#">${$item.data}</a>',
                pag_nav_start: 5,
                pag_nav_end: 2,
                page_pointer: 0,
                start_page: 0,
                items_a_page: 5 // Number of items on a single page.
            },
            opts = $.extend(defaults, options);

        init();
        buildUI();
        
        return {
            moveToPage: moveToPage,
            buildUI: buildUI,
            appendItem: appendItem,
            prependItem: prependItem
        };

        function appendItem(text) {
            self.append('<' + opts.data_element + '>'  + text + '</' + opts.data_element + '>'); 

            // After the element has been added , a UI rebuild is needed.
            buildUI();
        }

        function prependItem(text) {
            self.prepend('<' + opts.data_element + '>'  + text + '</' + opts.data_element + '>'); 
            buildUI();
        }


        function init() {
           //setup our pagination template
            $.template('pag_nav_wrapper_tmpl', opts.pag_nav_el);

           initValues();


        }

        function initValues() {

           if(self.children(opts.data_element)) {
                item_count = self.children(opts.data_element).length;
           }

           page_count = Math.ceil(item_count / opts.items_a_page); 
           item_pointer = page_pointer * page_count;

        }
        
        // Hide all items
        function hideAllPageItems() {
            self.children(opts.data_element).css({display: 'none'});
        }

        // The paging works by first hidding all page items then, 
        // showing all of the items on the current page.
        function moveToPage(i) {
            item_pointer = i * opts.items_a_page;

            hideAllPageItems();

            var show_page_items = function(i_p) {
                var $el;
                i_p++;
                $el = self.children(opts.data_element).filter('  li:nth-child(' + i_p + ')');

                $el.css({display: 'block'});

                return i_p;
            };


            for(var i=0; i < opts.items_a_page; i++) { 
                item_pointer = show_page_items(item_pointer);
            }
        }

        function buildUI() {
            initValues();

            if(opts.pag_element) {
                buildPaginator();
            }

            
            moveToPage(opts.start_page);

            // Setup event handlers.
            $('.pagination_page').click(function(e) {
                var page = parseInt(e.currentTarget.innerHTML);
                moveToPage(--page);
            });
        }

        function buildPaginator() {
            var i,
                _buildPaginator = function() {
                    if(page_count > opts.pag_nav_start + opts.pag_nav_end) {

                        i=1;
                        do {
                            $.tmpl("pag_nav_wrapper_tmpl", i).appendTo(opts.pag_element);
                            i++;
                        } while(i <= page_count && opts.pag_nav_start >= i);

                        $.tmpl("&nbsp; ... &nbsp;").appendTo(opts.pag_element);

                        i = page_count - opts.pag_nav_end;
                        i++;
                        do {
                            $.tmpl("pag_nav_wrapper_tmpl", i).appendTo(opts.pag_element);
                            i++;
                        } while(i <= page_count );

                    } else {

                        i=1;
                        do {
                            $.tmpl("pag_nav_wrapper_tmpl", i).appendTo(opts.pag_element);
                            i++;
                        } while(i <= page_count );
                         
                    }
                };

            // Check if there the pagination links have been constructed before
            if(!$(opts.pag_element).has('a').length) {
                _buildPaginator();
            } else {
                // remove the links and rebuild the pagination menu 
                $(opts.pag_element).empty();

                _buildPaginator();
            }
        }


        // Count total pages
        // slice the pages function
        // buildUI
        //
    };
})( jQuery );
