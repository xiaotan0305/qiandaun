<?php
/**
 * Project: 手机搜房
 * File: uploadimgcallback.php
 *
 *
 * <pre> 描述：图片上传文件 </pre>
 *
 * @category   PHP
 * @package    Web
 * @subpackage Web
 * @author     yueyanlei <yueyanlei@soufun.com>
 * @copyright  2013 Soufun, Inc.
 * @license    BSD Licence
 * @link       http://example.com
 */

/**
 *图片上传文件
 *
 *
 * Long description for file (if any)...
 *
 * @category   PHP
 * @package    File
 * @subpackage Web
 * @author     yueyanlei <yueyanlei@soufun.com>
 * @copyright  2013 Soufun, Inc.
 * @license    BSD Licence
 * @link       http://example.com
 */
$host = $_SERVER['HTTP_HOST'];
preg_match("/[\w\-]+\.\w+$/", $host, $arr);
$domain = $arr[0];
?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gbk" />
<title>uploadimgcallback</title><br>
<script>
document.domain = "<?php echo $domain;?>";
</script>
</head>

<body>
<div><?php echo $_GET['imgurl'];?></div>
</body>
</html>
